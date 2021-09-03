module.exports = {
    format_time: (date) => {
        return date.toLocaleTimeString();
    },
    format_date: (date) => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${
            new Date(date).getFullYear()}`;
    },
    stringify: (tags) => {
        let stringTag = '';
        if(tags){
            tags.forEach((tag, index, array) =>{
                console.log(tag.name);
                stringTag += tag.name;
                if(index !== array.length -1){
                    stringTag += ', '
                }
            });
            console.log(stringTag);
        }
        return stringTag;
    },
    parameterize: (text) => {
        return text.replace(/\s+/g, '-').toLowerCase();
    }
};