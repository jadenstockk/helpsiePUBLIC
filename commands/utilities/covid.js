module.exports = {
  commands: ['covid'],
  group: 'utilities',

  callback: (message, args, client) => {

    const Discord = require("discord.js");
    const fetch = require("node-fetch");

    let countryInput = args.slice(0).join(' ');

    if (!args[0]) return covid(``, `Global`)

    covid(`countries/${countryInput}`, countryInput)

    function covid(link, countries) {

      fetch(`https://covid19.mathdro.id/api/${link}`)
      .then((response) => response.json())
      .then((data) => {

        let confirmed = data.confirmed.value.toLocaleString();
        let recovered = data.recovered.value.toLocaleString();
        let deaths = data.deaths.value.toLocaleString();
        let date = data.lastUpdate;

        let countryFormatted = (countries.toLowerCase().charAt(0).toUpperCase() + countries.slice(1)).replace('_', ' ').replace('_', ' ').replace('_', ' ');
        let spaceCharacter = countryFormatted.indexOf(' ');
        if (spaceCharacter > -1) countryFormatted = countryFormatted.slice(0, spaceCharacter + 1) + countryFormatted.charAt(spaceCharacter + 1).toUpperCase() + countryFormatted.slice(spaceCharacter + 2, countryFormatted.length)
    
        let spaceCharacter2 = countryFormatted.indexOf(' ', spaceCharacter + 1);
        if (spaceCharacter2 > -1) countryFormatted = countryFormatted.slice(0, spaceCharacter2 + 1) + countryFormatted.charAt(spaceCharacter2 + 1).toUpperCase() + countryFormatted.slice(spaceCharacter2 + 2, countryFormatted.length)

        const embed = new Discord.MessageEmbed()
          .setAuthor(`COVID-19 Statistics for ${countryFormatted}`, `https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SARS-CoV-2_without_background.png/110px-SARS-CoV-2_without_background.png`)
          .addFields(
            { name: "Confirmed Cases", value: confirmed, inline: true },
            { name: "Recovered", value: recovered, inline: true },
            { name: "Deaths", value: deaths, inline: true },
          )
          .setDescription(`[Click here for more information about the Corona Virus](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public)\n​​​​​   `)
          .setColor("#059DFF")

        message.channel.send(embed);
      })
      .catch((e) => {
        return covid(``, `Global`)
      });
    }
  },
};
