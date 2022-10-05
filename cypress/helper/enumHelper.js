export function getEnumByValue(enumType, value){
    for(var key in enumType){
        if(enumType[key].toLowerCase() === value.toLowerCase())
            return key;
        else
            return null;
    }
}
