import os

def ensure_typescript():
    print("Updating typescript version")
    os.system("npm install -g typescript")


def get_language():
    if get_language.language == "":
        res = input("Do you want to enable Typescript and ES6+ support (requires node.js to build project)? [Y/n]")
        if res.lower() == "n": 
            get_language.language = "javascript"
        else:
            get_language.language = "typescript"
            ensure_typescript()

    return get_language.language
get_language.language = ""


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
        path = os.path.join(directory, f)
        if(os.path.exists(path)):
            os.remove(path)


def init_adb(make_file, dirname):
    pack_name = input("Enter your pack directory name [Inner_Core]: ")
    if pack_name == "":
        pack_name = "Inner_Core"

    make_file["make"]["pushTo"] = "storage/emulated/0/games/horizon/packs/" + pack_name + "/innercore/mods/" + dirname



