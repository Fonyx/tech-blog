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
        tags.forEach((tag, index, array) =>{
            console.log(tag.tag_name);
            stringTag += tag.tag_name;
            if(index !== array.length -1){
                stringTag += ', '
            }
        });
        console.log(stringTag);
        return stringTag;
    }
};