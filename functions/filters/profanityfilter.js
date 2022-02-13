const Discord = require("discord.js");
const { blacklisted, blacklisted2, blacklisted3, pwebsites } = require("./blacklist.json");
const warnUser = require("../moderation/warn");
const characterdecoder = require('replace-special-characters');


module.exports = {
  filterprofanity: async (content, client) => {

    let foundInText = false;
    let messageLowerCase = content.toLowerCase();
    let messageLength = content.length;
    let messageNoSpaces = messageLowerCase.replace(/\s+/g, '');

    let filtered = [];

    function checkProfanity() {
      function removeDuplicateCharacters(string) {
        return string
          .split('')
          .filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
          })
          .join('');
      }
  
      let messageNoSpecialCharacters = messageLowerCase;
      let messageReplaceAt = messageLowerCase.replace(/[0-9]/g, '');
      let messageReplaceDollar = messageLowerCase.replace(/[0-9]/g, '');
      let messageReplaceExclamation = messageLowerCase.replace(/[0-9]/g, '');
      let messageReplaceLine = messageLowerCase.replace(/[0-9]/g, '');
      let messageReplaceZero = messageLowerCase;
      let messageReplaceAll = messageLowerCase;

      let specialCharacters = ['.', ',', '_', '=', '+', '<', '>', "'", ':', ';', '/', /[0-9]/g, ')', '(', '#', '*', '%', '^', '&', '!', '?', '|', '@', '-'];

      function replaceSpecialCharacters(input) {
        let output = input;

        specialCharacters.forEach(c => {
          output = output.replace(c, '');          
        })

        return output;
      }


  
      for (var i = 0; i < messageLength; i++)
      messageNoSpecialCharacters = replaceSpecialCharacters(messageNoSpecialCharacters);

      for (var i = 0; i < messageLength; i++)
      messageReplaceAll = messageReplaceAll.replace('0', 'o').replace('|', 'i').replace('!', 'i').replace('$', 's').replace('@', 'a'),
      messageReplaceZero = messageReplaceZero.replace('0', 'o'),
      messageReplaceLine = messageReplaceLine.replace('|', 'i'),
      messageReplaceExclamation = messageReplaceExclamation.replace('!', 'i'),
      messageReplaceDollar = messageReplaceDollar.replace('$', 's'),
      messageReplaceAt = messageReplaceAt.replace('@', 'a')

      let combinedReplace = (`${messageReplaceAll} ${messageReplaceZero} ${messageReplaceLine} ${messageReplaceExclamation} ${messageReplaceDollar} ${messageReplaceAt}`)
      let combinedNoSpacesToLowerCase = removeDuplicateCharacters(messageNoSpaces) + removeDuplicateCharacters((messageNoSpecialCharacters.replace(/[0-9]/g, '')).replace(/\s+/g, '')) + messageNoSpecialCharacters.replace(/[0-9]/g, '') + messageNoSpaces + messageNoSpecialCharacters.replace(/\s+/g, '') + removeDuplicateCharacters(messageNoSpecialCharacters) + removeDuplicateCharacters(messageReplaceAt) + removeDuplicateCharacters(messageReplaceZero) + removeDuplicateCharacters(messageReplaceExclamation) + removeDuplicateCharacters(messageReplaceDollar) + removeDuplicateCharacters(messageReplaceLine) + removeDuplicateCharacters(characterdecoder(messageLowerCase)) + characterdecoder(messageNoSpaces) + removeDuplicateCharacters(messageReplaceAll);
      let combinedSimple = (`${messageNoSpecialCharacters} ${combinedReplace} ${characterdecoder(combinedReplace)} ${removeDuplicateCharacters(characterdecoder(combinedReplace))} ${removeDuplicateCharacters(characterdecoder(combinedReplace).replace(/\s+/g, ''))}`)
      
  
      for (var i in blacklisted) {
        if (messageLowerCase.includes(blacklisted[i].toLowerCase()) && !foundInText) filtered.push(blacklisted[i]), blacklistNumber = '1', foundInText = true;
      }
      for (var i in blacklisted2) {
        if (messageLowerCase === blacklisted2[i].toLowerCase() ||
        messageLowerCase.endsWith(` ${blacklisted2[i].toLowerCase()}`) ||
        messageLowerCase.startsWith(`${blacklisted2[i].toLowerCase()} `) ||
        messageLowerCase.includes(` ${blacklisted2[i].toLowerCase()} `) ||
        messageLowerCase.includes(`||${blacklisted2[i].toLowerCase()}||`) ||
        combinedSimple === blacklisted2[i].toLowerCase() ||
        combinedSimple.endsWith(` ${blacklisted2[i].toLowerCase()}`) ||
        combinedSimple.startsWith(`${blacklisted2[i].toLowerCase()} `) ||
        combinedSimple.includes(` ${blacklisted2[i].toLowerCase()} `) ||
        combinedSimple.includes(`||${blacklisted2[i].toLowerCase()}||`) && !foundInText) filtered.push(blacklisted2[i]), blacklistNumber = '2', foundInText = true;
      }
      for (var i in blacklisted3) {
        if (combinedSimple.includes(blacklisted3[i].toLowerCase()) ||
        combinedNoSpacesToLowerCase.includes(blacklisted3[i].toLowerCase()) && !foundInText) filtered.push(blacklisted3[i]), blacklistNumber = '3', foundInText = true;
      }
      for (var i in pwebsites) {
        if (messageLowerCase.includes(pwebsites[i].toLowerCase()) && !foundInText) filtered.push(pwebsites[i]), blacklistNumber = '4', foundInText = true;
      }

      return foundInText;
    }
    if (!checkProfanity()) return;

    let finalFiltered = [];
    filtered.forEach(word => {
      if (!finalFiltered.includes(word)) finalFiltered.push(word);
    })

    return finalFiltered;
  },
};
