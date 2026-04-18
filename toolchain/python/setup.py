import os
from os.path import join, exists, isdir, basename, isfile
import sys
import json
from os import getcwd

from base_config import BaseConfig

from utils import clear_directory, copy_directory, ensure_directory, copy_file



def setup_mod_info(make_file):
	name = input("Enter project name: ")
	author = input("Enter author name: ")
	version = input("Enter project version [1.0]: ")
	description = input("Enter project description: ")

	if version == "":
		version = "1.0"

	make_file["global"]["info"] = {
		"name": name,
		"author": author,
		"version": version,
		"description": description
	}

def cleanup_if_required(directory):
	res = input("Do you want to clean up the project? [Y/n]: ")
	if res.lower() == 'n':
		return

	to_remove = [
		"toolchain-setup.py",
		"toolchain-import.py",
		"toolchain.zip"
	]
	for f in to_remove:
		path = join(directory, f)
		if(exists(path)):
			os.remove(path)


def init_directories(directory):
	assets_dir = join(directory, "src", "assets")
	clear_directory(assets_dir)
	os.makedirs(join(assets_dir, "gui"))
	os.makedirs(join(assets_dir, "res", "items-opaque"))
	os.makedirs(join(assets_dir, "res", "terrain-atlas"))
	libs_dir = join(directory, "src", "lib")
	clear_directory(libs_dir)
	os.makedirs(libs_dir)
	os.makedirs(join(directory, "src", "preloader"))
	os.makedirs(join(assets_dir, "resource_packs"))
	os.makedirs(join(assets_dir, "behavior_packs"))
	with(open(join(directory, "src", "dev", "header.js"), "w", encoding="utf-8")) as file:
		file.write("")



def init_adb(make_file, dirname):
	pack_name = input("Enter your pack directory name [Inner_Core]: ")
	if pack_name == "":
		pack_name = "Inner_Core"

	make_file["make"]["pushTo"] = "storage/emulated/0/games/horizon/packs/" + pack_name + "/innercore/mods/" + dirname


print("running project setup script")

destination = sys.argv[1]
make_path = join(destination, "make.json")

if not (exists(make_path)):
	exit("invalid arguments passed to import script, usage: \r\npython setup.py <destination>")

with open(make_path, "r", encoding="utf-8") as make_file:
	make_obj = json.loads(make_file.read())

if destination == '.':
	dirname = basename(os.getcwd())
else:
	dirname = basename(destination)


init_adb(make_obj, dirname)
print("initializing mod.info")
setup_mod_info(make_obj)
print("initializing required directories")
init_directories(destination)
cleanup_if_required(destination)


with open(make_path, "w", encoding="utf-8") as make_file:
	make_file.write(json.dumps(make_obj, indent=" " * 4))

print("project successfully set up")
