function checkText(inputText) {
    console.log("::: Running checkText :::", inputText);
    if(!(inputText && /\S/.test(inputText))){
        return Main.formTypes.INV;
    }
    if(/https?:\/\/*.*/.test(inputText)) {
        return Main.formTypes.URL;
    }
    return Main.formTypes.TEXT;
}

export { checkText }
