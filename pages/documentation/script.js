function getCount(foldername) {
    var myObject, f, filesCount;
    myObject = new ActiveXObject("Scripting.FileSystemObject");
    f = myObject.GetFolder(foldername);
    filesCount = f.files.Count;
    document.write("The number of files in this folder is: " + filesCount);
}

getCount("./documentation")