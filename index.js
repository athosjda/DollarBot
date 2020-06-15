const Discord = require('discord.js')
const rp = require('request-promise')
const $ = require('cheerio')
require('dotenv').config()

const url = 'https://www.infomoney.com.br/ferramentas/cambio/'
const bot = new Discord.Client()
const helpMSG = `esse é o Help :)
            
O DollarBot é um bot relacionado a dados monetários.
Para usar o Bot use o prefixo \'$grana\'

 ** Comandos **
O comando \'[moeda]\' mostra a cotação no momento atual da moeda selecionada.

O comonado \'[moeda] [valor]\' converte o valor na moeda selecionada para R$.

 ** Moedas **
As moedas disponiveis são:
 * Peso Argentino - ARS
 * Dólar Australiano - AUD
 * Dólar Canadense - CAD
 * Franco Suíço - CHF
 * Dólar Comercial - USD
 * Dólar Turismo - ZDTU
 * Euro - EUR
 * Libra Esterlina - GBP
 * Iene - JPY
 `

bot.login(process.env.tokenBot)

bot.on('ready', () => {
    console.log('Pronto para rodar. Lets GO!!')
})

function mensagem(nome, valor){
    frases = [
        'o '+nome+' está a R$'+valor+' curtiu?',
        'tá aê chefe R$'+valor+'.',
        'pega aí o seu '+nome+' que está a R$'+valor+' e não me enche mais não.',
        'SERA QUE EU NÃO TENHO UM MINUTO DE PAZ NESSE CARALHO??? Pega essa miseria '+nome+' aí  que tá a R$'+valor+'.',
        'não sei se é bom ou ruim, mas tá aê o seu '+nome+' a R$'+valor+'.'
    ]
    return frases[Math.floor(Math.random() * 10)%frases.length]
}

function scrapingDolar(msg, moeda, reais){
    rp(url).then( function(html){
        let dados = []
        let moedas = ['ARS', 'AUD', 'CAD', 'CHF', 'USD', 'ZDTU', 'EUR', 'GBP', 'JPY']
        let indice = 0
        let resp = ''
        const tam = $('div > div > table > tbody > tr > td', html).length

        for(i = 0; i < tam; i++){
            if(i%5 === 0 || i%5 === 2){
                if(i%5 == 0){
                    dados.push(moedas[indice])
                    indice = indice+1
                }
                dados.push($('div > div > table > tbody > tr > td', html)[i].children[0].data)
            }
        }

        indice = dados.indexOf(moeda)
        if(reais != undefined){
            val = dados[indice+2]
            val = val.replace(',', '.')
            reais = reais.replace(',', '.')
            resp = String(parseFloat(val)*parseFloat(reais)).replace('.', ',')
            resp = 'são R$'+resp+'.'
        }else if(indice != -1){
            resp = mensagem(dados[indice+1], dados[indice+2])
        }else{
            resp = 'Comando invalido! Acesse o \':grana help\' para mais informações.'
        }
        msg.reply(resp)
    })
    .catch(function(err){
        console.log(err)
    })
}


bot.on('message', msg => {
    frase = msg.content
    frase = frase.split(' ')
    if(frase[0] == '$grana'){
        if(frase.length > 3){
            msg.reply('Comando invalido!')
        }else if(frase.length == 3){
            scrapingDolar(msg, frase[1], frase[2])
        }else if(frase[1] == 'help'){
            msg.reply(helpMSG)
        }else{
            scrapingDolar(msg, frase[1])
        }
    }
})