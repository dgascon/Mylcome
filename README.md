# Discord bot Mylcome

Hi! I'm Gascon Dylan, young developers who study at 42 Lyon in France. I have develop this bot for my server, i hope you will enjoy !

# Description
This bot allow you of create a channel for every user which join your server. The settings contains :
* Name of channel
* Prefix (default '__?__')
* Message into the channel
* Reaction at message
* Category or to be yours channels
* AutoRoles give roles when a user join the server
* RemoveRoles removed roles when a member of staff click on a react who close the canal
* Removeauto removed channel when a user left the server

## Commands

|Name|aliases|arguments|options|descriptions|exemple|
|--|--|--|--|--|--|
|setprefix|sprefix|[string]|*none*|Set the prefix used|`?sprefix !?`
|setname|sname|[string]|*{user} (username) {userid} (userid)*|Set the name of canal|`?sname ⼁🖤⼁lupanaria-of-{user}`
|setdescription|sdesc|[string]|*{user} (username) {userid} (userid)*|Set the message into the canal (prefixed by user-tag)|`?sdesc Hello and welcome, i invite you to check the rules at <#01234567489>`
|setcategory|scategory|[integer]|*none*|Set the category that will receive the channels|`?scategory 0123456789`
|setreact|sreact|[emoji tagrole..]|*close (close the canal)*|Set the react of the message *(the separateur is commas and space [, ])*|`?sreact :smiling_imp: @role1, :pray: @role2 @role3 close, :cross: close`
|setroles|sroles|[roles-tag]|*none*|Set roles who going to be add when a user join|`?sroles @role1 @role2 @role3`
|setremoveroles|srroles|[roles-tag]|*none*|Set roles who going to be removed when the canal is closed|`?srroles @roles1`
|setremoveauto|srauto|[true/false/1/0]|*none*|This define the remove automatic of channel when a user left a server|`?srauto true`

## Invitation

https://discord.com/api/oauth2/authorize?client_id=847852979981254667&permissions=8&scope=bot
