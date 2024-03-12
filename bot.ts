import {CommandContext, Context,} from 'grammy'
import config from 'config'
import assert from 'assert'
import {bot, setupBot} from './context'
import {startTracking, track} from './ban'
import i18next from 'i18next'
import { configureI18Next } from './i18next/i18next.config'

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

    await configureI18Next()

    bot.on("message:entities:mention", (ctx) => {
        const kickerMentioned = ctx.message?.text?.includes(`@${ctx.me.username}`)
        const isReply = ctx.update?.message?.reply_to_message
        if (kickerMentioned && isReply) {
            trackBanVotes(ctx)
        }
    })

    bot.reaction(["👍"], (ctx) => {
        track(ctx, ctx.update.message_reaction.message_id, ctx.from.id)
    })

    await bot.api.sendMessage(config.get('telegram.bot_admin'), i18next.t('online_message', { buildDate: config.get('build.date')}))
    console.log(`Bot online\nBuild date: ${config.get('build.date')}`)
    return bot.start({
        allowed_updates: ['message', 'callback_query', 'poll', "message_reaction", "message_reaction_count"]
    })
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
    return ctx.reply(i18next.t('start_message', { username: ctx.from.username }))
}

function help(ctx: CommandContext<Context>) {
    console.log(`/help from ${ctx.from.username} id:${ctx.from?.id}`)
    return ctx.reply(i18next.t('help_message'))
}

function info(ctx: CommandContext<Context>) {
    console.log(`/info from ${ctx.from.username} id:${ctx.from?.id}`)
    return ctx.reply(i18next.t('info_message', { buildDate: config.get<string>('build.date') }))
}

function mask(token: string, visibleChars: number = 11): string {
    const hiddenPart = '*'.repeat(token.length - visibleChars)
    return token.substring(0, visibleChars) + hiddenPart
}

async function trackBanVotes(ctx: Context): Promise<void> {
    // ctx.banChatMember()
    const replyTo = ctx.update?.message?.reply_to_message
    const complaint = {
        banCandidate: replyTo?.from?.id,
        offendingMsgId: replyTo?.message_id,
        voteMsgId: ctx.update?.message?.message_id,
        votesBy: new Set<number>([ctx.from.id])
    }

    assert(complaint.banCandidate && complaint.offendingMsgId && complaint.voteMsgId,
        `complaint.banCandidate && complaint.offendingMsgId && complaint.voteMsgId`)

    const banCandidateUsername = replyTo?.from?.username
    const warning = i18next.t('user_warning', { username: banCandidateUsername })
    console.log(warning)

    startTracking(complaint)
    await ctx.reply(warning)
}
