const { MessageEmbed } = require("discord.js");
const escapeMarkdown = require('discord.js').Util.escapeMarkdown;
const SlashCommand = require("../../lib/SlashCommand");
const prettyMilliseconds = require("pretty-ms");

const command = new SlashCommand()
	.setName("nowplaying")
	.setDescription("Shows the song currently playing in the voice channel.")
	.setRun(async (client, interaction, options) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}
		
		let player;
		if (client.manager) {
			player = client.manager.players.get(interaction.guild.id);
		} else {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("Lavalink node is not connected"),
				],
			});
		}
		
		if (!player) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("The bot isn't in a channel."),
				],
				ephemeral: true,
			});
		}
		
		if (!player.playing) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("There's nothing playing."),
				],
				ephemeral: true,
			});
		}
		
		const song = player.queue.current;
        var title = escapeMarkdown(song.title)
        var title = title.replace(/\]/g,"")
        var title = title.replace(/\[/g,"")
		const embed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setAuthor({ name: "Now Playing", iconURL: client.config.iconURL })
			.setFields([
				{
					name: "Requested by",
					value: `<@${ song.requester.id }>`,
					inline: true,
				},
				{
					name: "Duration",
					value: song.isStream
						? `\`LIVE\``
						: `\`${ prettyMilliseconds(player.position, {
							secondsDecimalDigits: 0,
						}) } / ${ prettyMilliseconds(song.duration, {
							secondsDecimalDigits: 0,
						}) }\``,
					inline: true,
				},
			])
			// Set thumbnail of the song
			.setThumbnail(song.displayThumbnail("maxresdefault"))
			// Set regular image of the song
			.setImage('https://cdn.discordapp.com/attachments/961622755411918868/1216713661490663434/jake_music.gif?ex=660163e6&is=65eeeee6&hm=f9adb37387f122b1a99ebacae3cddd2b4b6d1c667322e1bf1c39882dbc13ad01&') // Replace 'YOUR_IMAGE_URL_HERE' with the actual URL of the image
			.setDescription(`[${ title }](${ song.uri })`);
		return interaction.reply({ embeds: [embed] });
	});
module.exports = command;

