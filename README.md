# KickerBot

Чтобы запустить KickerBot, выполните следующие шаги:

1. **Отредактируйте файл конфигурации `development.yaml`**:
    - Укажите токен вашего бота в **`bot_token`**.
    - Укажите ваш Telegram ID в **`bot_admin`**.
    Пример:
    
    ```yaml
    telegram:
        bot_token: "ВАШ_ТОКЕН_БОТА"
        bot_admin: ВАШ_TELEGRAM_ID
    ```
    
2. **Запустите бота с помощью команды**:
    
    ```bash
    ./add_date_to_config.sh && yarn esbuild bot.ts --bundle --platform=node --outfile=dist/telegram-bot.js && node ./dist/telegram-bot.js
    ```
    

Эта команда сначала обновит дату в конфиге, затем соберет исходный код бота в один файл и, наконец, запустит собранный бот.
