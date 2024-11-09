import asyncio
import logging
import sys
from os import getenv
from dotenv import load_dotenv

from aiogram import Bot, Dispatcher, html, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message

import secrets
import requests
import httpx

load_dotenv()
TOKEN = getenv('TOKEN')

dp = Dispatcher()


@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    await message.answer(f"Привет! Это я Бот UrbanHelper. Используй клавиатуру или команду /connect_telegram,
                          чтобы подключить телеграмм аккаунт к сервису")

@dp.message(Command('connect_telegram'))
async  def connect_telegram(message: Message) -> None:
    token = secrets.token_hex(16)
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post('http://127.0.0.1:8000/user/create',
                                          json={'telegram_id': message.from_user.id,
                                                'token': token})
            if response.status_code == 200:
                await message.answer('Вы успешно подключили свой аккаунт к сервису UrbanHelper, можете использовать токен:')
                await message.answer(token)
            elif response.status_code == 500:
                await message.answer('Ваш аккаунт уже подключен к сервису UrbanHelper')
            else:
                print(response.status_code)
        except httpx.HTTPError as e:
            print(e)

async def main() -> None:
    bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())