import {CommandContext, Context,} from 'grammy'
import config from 'config'
import {bot, setupBot} from "./context"


main()

function main() {
    logStartupInfo()
    launch()
        .then(() => {
            bot.catch((err) => {
                const ctx = err.ctx
                console.error(
                    `Error while handling update ${ctx.update.update_id}:`
                )
            })
        })
        .catch((error) => {
            console.error('Error during launching telegram bot', error)
        })
}

async function launch(): Promise<void> {
    setupBot(config.get('telegram.bot_token'))

    setupCommands()

    bot.on("message:entities:mention", (ctx) => {
        // console.log("ctx=", ctx)
        if (ctx.message?.text?.includes(`@${ctx.me.username}`)) {
            console.log("I'm mentioned -----------------------------------")

            const replyToMessage = ctx.update?.message?.reply_to_message
            if (replyToMessage) {

            }
        }
    })

    await bot.api.sendMessage(config.get('telegram.bot_admin'), 'Hi I\'m online')
    console.log('Bot online')
    return bot.start()
}

function setupCommands() {
    bot.command('start', start)
    bot.command('help', help)
    bot.command('info', info)
}

function logStartupInfo() {
    const partialToken = mask(config.get('telegram.bot_token'))
    console.log(`Bot Starting...\nBot Token: ${partialToken}`)
}

function start(ctx: CommandContext<Context>) {
    console.log(`/start from ${ctx.from.username} id:${ctx.from?.id}`)
    return ctx.reply(`Hello ${ctx.from.username}`)
}

function help(ctx: CommandContext<Context>) {
    console.log(`/help from ${ctx.from.username} id:${ctx.from?.id}`)
    return ctx.reply('/start - start talking, get your username and ID\n/help - this message\n/info - bot build date')
}

function info(ctx: CommandContext<Context>) {
    console.log(`/info from ${ctx.from.username} id:${ctx.from?.id}`)
    return ctx.reply(`Bot build date: ${config.get<string>('build.date')}`)
}

function mask(token: string, visibleChars: number = 11): string {
    const hiddenPart = '*'.repeat(token.length - visibleChars)
    return token.substring(0, visibleChars) + hiddenPart
}

function trackBanVotes(ctx: Context): void {
    // banCandidate: number, offendingMsgId: number, voteMsgId: number
    console.log(`We're watching you, mr Anderson @`)
}
