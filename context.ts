import { Bot } from 'grammy'

export let bot: Bot

export function setupBot(token: string): void {
    bot = new Bot(token)
}
