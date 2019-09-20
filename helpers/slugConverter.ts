export class SlugConverter  {
    converter(palavra) {
        const retorno = palavra.trim().replace(" ","").toLowerCase();
        return retorno;
    }
}


/*module.exports = {
    converter: function(palavra) {
        const retorno = palavra.trim().replace(" ","").toLowerCase();
        return retorno;
    }
}*/