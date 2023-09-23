const fs = require('fs');

const [arg] = process.argv.slice(2)

const argArray = arg.split('\\')

const category = argArray.pop();

const fileNames = fs.readdirSync(arg);

fileNames.forEach((fileName)=>{
    let nameArray = fileName.split('-');
    let newName = '';
    let oldName = `${arg}/${fileName}`

    // 文件類型
    let pushPart = nameArray.slice(0, -4)
    let otherPart = nameArray.slice(-4);
    pushPart.push(category);
    nameArray = pushPart.concat(otherPart);

    // 前兩個相同刪除第一個
    // 前兩個不同，保留兩者
    if(nameArray[0] === nameArray[1]){
        nameArray = nameArray.slice(1)
    }

    // 西元年轉民國
    let length = nameArray.length 
    const AC =parseInt(nameArray[length-3], 10);
    nameArray[length-3] = AC - 1911;
    let timeArray = nameArray.splice(length - 3);
    let time = timeArray.join('.');
    nameArray.push(time);

    newName = nameArray.join('-')

    fs.rename(oldName, `${arg}/${newName}`, (err)=>{
        if(err) console.log(err)
    })
});