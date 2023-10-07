import os
import os.path
import sys
import time

from utils import ensure_directory, ensure_file_dir, clear_directory, copy_file, copy_directory

make_config = None
registered_tasks = {}
locked_tasks = {}
devnull = open(os.devnull, "w")


def get_make_config():
	global make_config
	if make_config is None:
		from make_config import make_config as config
		make_config = config
	return make_config


def lock_task(name, silent=True):
	path = get_make_config().get_path(f"toolchain/build/lock/{name}.lock")
	ensure_file_dir(path)
	await_message = False

	if os.path.exists(path):
		while True:
			try:
				if os.path.exists(path):
					os.remove(path)
				break
			except IOError as _:
				if not await_message:
					await_message = True
					if not silent:
						sys.stdout.write(f"task {name} is locked by another process, waiting for it to unlock.")
					if name in locked_tasks:
						error("ERROR: dead lock detected", code=-2)
				if not silent:
					sys.stdout.write(".")
					sys.stdout.flush()
				time.sleep(0.5)
	if await_message:
		if not silent:
			print("")
	open(path, "tw").close()
	locked_tasks[name] = open(path, "a")


def unlock_task(name):
	if name in locked_tasks:
		locked_tasks[name].close()
		del locked_tasks[name]
	path = get_make_config().get_path(f"toolchain/build/lock/{name}.lock")
	if os.path.isfile(path):
		os.remove(path)


def unlock_all_tasks():
	for name in list(locked_tasks.keys()):
		unlock_task(name)


def task(name, lock=None):
	if lock is None:
		lock = []

	def decorator(func):
		def caller(*args, **kwargs):
			lock_task(name, silent=False)
			for lock_name in lock:
				lock_task(lock_name, silent=False)
			os.system("color")
			print(f"\033[92m> executing task: {name}\033[0m")
			task_result = func(*args, **kwargs)
			unlock_task(name)
			for lock_name in lock:
				unlock_task(lock_name)
			return task_result

		registered_tasks[name] = caller
		return caller

	return decorator


@task("compileNativeDebug", lock=["native", "cleanup", "push"])
def task_compile_native_debug():
	abi = get_make_config().get_value("make.debugAbi", None)
	if abi is None:
		abi = "armeabi-v7a"
		print(f"WARNING: no make.debugAbi value in config, using {abi} as default")
	from native.native_build import compile_all_using_make_config
	return compile_all_using_make_config([abi])


@task("compileNativeRelease", lock=["native", "cleanup", "push"])
def task_compile_native_release():
	abis = get_make_config().get_value("make.abis", [])
	if abis is None or not isinstance(abis, list) or len(abis) == 0:
		error(f"ERROR: no make.abis value in config")
	from native.native_build import compile_all_using_make_config
	return compile_all_using_make_config(abis)


@task("compileJavaDebug", lock=["java", "cleanup", "push"])
def task_compile_java_debug():
	from java.java_build import compile_all_using_make_config
	return compile_all_using_make_config()


@task("compileJavaRelease", lock=["java", "cleanup", "push"])
def task_compile_java_release():
	from java.java_build import compile_all_using_make_config
	return compile_all_using_make_config()


@task("buildScripts", lock=["script", "cleanup", "push"])
def task_build_scripts():
	from script_build import build_all_scripts
	return build_all_scripts()


@task("buildResources", lock=["resource", "cleanup", "push"])
def task_resources():
	from script_build import build_all_resources
	return build_all_resources()


@task("buildInfo", lock=["cleanup", "push"])
def task_build_info():
	import json
	config = get_make_config()
	with open(config.get_path("output/mod.info"), "w") as info_file:
		info = dict(config.get_value("global.info", fallback={"name": "No was provided"}))
		if "icon" in info:
			del info["icon"]
		info_file.write(json.dumps(info, indent=" " * 4))
	icon_path = config.get_value("global.info.icon")
	if icon_path is not None:
		copy_file(config.get_path(icon_path),
				  config.get_path("output/mod_icon.png"))
	return 0


@task("buildAdditional", lock=["cleanup", "push"])
def task_build_additional():
	overall_result = 0
	for additional_dir in get_make_config().get_value("additional", fallback=[]):
		if "source" in additional_dir and "targetDir" in additional_dir:
			for additional_path in get_make_config().get_paths(additional_dir["source"]):
				if not os.path.exists(additional_path):
					print("non existing additional path: " + additional_path)
					overall_result = 1
					break
				target = get_make_config().get_path(os.path.join(
					"output",
					additional_dir["targetDir"],
					os.path.basename(additional_path)
				))
				if os.path.isdir(additional_path):
					copy_directory(additional_path, target)
				else:
					ensure_file_dir(target)
					copy_file(additional_path, target)
	return overall_result


@task("pushEverything", lock=["push"])
def task_push_everything():
	from push import push
	return push(get_make_config().get_path("output"))


@task("clearOutput", lock=["assemble", "push", "native", "java"])
def task_clear_output():
	clear_directory(get_make_config().get_path("output"))
	return 0


@task("excludeDirectories", lock=["push", "assemble", "native", "java"])
def task_exclude_directories():
	config = get_make_config()
	for path in config.get_value("make.excludeFromRelease", []):
		for exclude in config.get_paths(os.path.join("output", path)):
			if os.path.isdir(exclude):
				clear_directory(exclude)
			elif os.path.isfile(exclude):
				os.remove(exclude)
	return 0


@task("buildPackage", lock=["push", "assemble", "native", "java"])
def task_build_package():
	import shutil
	config = get_make_config()
	output_dir = config.get_path("output")
	mod_folder = config.get_value("make.modFolder")
	output_file = config.get_path(mod_folder + ".icmod")
	output_root_tmp = config.get_path("toolchain/build")
	output_dir_tmp = output_root_tmp + "/" + mod_folder
	output_file_tmp = output_root_tmp + "/mod.zip"
	ensure_directory(output_dir)
	ensure_file_dir(output_file_tmp)
	if os.path.isfile(output_file):
		os.remove(output_file)
	if os.path.isfile(output_file_tmp):
		os.remove(output_file_tmp)
	shutil.move(output_dir, output_dir_tmp)
	shutil.make_archive(output_file_tmp[:-4], 'zip', output_root_tmp, mod_folder)
	os.rename(output_file_tmp, output_file)
	shutil.move(output_dir_tmp, output_dir)
	return 0


@task("launchHorizon")
def task_launch_horizon():
	from subprocess import call
	call([make_config.get_adb(), "shell", "touch", "/storage/emulated/0/games/horizon/.flag_auto_launch"], stdout=devnull, stderr=devnull)
	result = call([make_config.get_adb(), "shell", "monkey", "-p", "com.zheka.horizon", "-c", "android.intent.category.LAUNCHER", "1"], stdout=devnull, stderr=devnull)
	if result != 0:
		print("\033[91mno devices/emulators found, try to use task \"Connect to ADB\"\033[0m")
	return 0

@task("stopHorizon")
def stop_horizon():
	from subprocess import call
	result = call([make_config.get_adb(), "shell", "am", "force-stop", "com.zheka.horizon"], stdout=devnull, stderr=devnull)
	if result != 0:
		print("\033[91mno devices/emulators found, try to use task \"Connect to ADB\"\033[0m")
	return result

@task("loadDocs")
def task_load_docs():
	import urllib.request
	print("downloading...")
	response = urllib.request.urlopen("https://docs.mineprogramming.org/core-engine.d.ts")
	content = response.read().decode('utf-8')

	with open(make_config.get_path("toolchain/declarations/core-engine.d.ts"), 'w') as docs:
		docs.write(content)

	print("complete!")
	return 0


@task("connectToADB")
def task_connect_to_adb():
	import re

	ip = None
	port = None
	pattern = re.compile(r"(\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}):(\d{5})")
	for arg in sys.argv:
		match = pattern.search(arg)
		if match:
			ip = match[0]
			port = match[1]

	if ip is None:
		print("incorrect IP-address")
		return 1

	print(f"connecting to {ip}")

	from subprocess import call
	call([make_config.get_adb(), "disconnect"], stdout=devnull, stderr=devnull)
	call([make_config.get_adb(), "tcpip", port], stdout=devnull, stderr=devnull)
	result = call([make_config.get_adb(), "connect", ip])
	return result


@task("cleanup")
def task_cleanup():
	config = get_make_config()
	clear_directory(config.get_path("toolchain/build/gcc"))
	clear_directory(config.get_path("toolchain/build/gradle"))
	clear_directory(config.get_path("toolchain/build/project"))

#                               not working
#     import java.java_build
#     java.java_build.cleanup_gradle_scripts()
	return 0


def error(message, code=-1):
	sys.stderr.write(message + "\n")
	unlock_all_tasks()
#    input("Press enter to continue...")
	exit(code)


if __name__ == '__main__':
	if len(sys.argv[1:]) > 0:
		for task_name in sys.argv[1:]:
			if task_name in registered_tasks:
				try:
					result = registered_tasks[task_name]()
					if result != 0:
						error(f"task {task_name} failed with result {result}", code=result)
				except BaseException as err:
					if isinstance(err, SystemExit):
						raise err

					import traceback
					traceback.print_exc()
					error(f"task {task_name} failed with above error")
#            else:
#                error(f"no such task: {task_name}")
	else:
		error("no tasks to execute")
	unlock_all_tasks()
