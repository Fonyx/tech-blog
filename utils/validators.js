
function stringSpacesNoNumbers(text){
    if(typeof(text) !== 'string'){
        throw new Error(`Type must be string, not ${typeof(text)}`);
    }
    for(let i=0; i < text.length; i++){
        let current = text[i];
        let textMatch = /[a-z A-Z]/g;
        let valid = textMatch.test(current);
        if(!valid){
            throw new Error('Only alphabet and space is allowed');
        }
    }
    return true;
}

const validators = {
    stringSpacesNoNumbers,
};

module.exports = validators;
