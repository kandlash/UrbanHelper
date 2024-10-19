import asyncio
import logging
import sys
from os import getenv

from aiogram import Bot, Dispatcher, html
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message

import secrets
import requests
import httpx

# Bot token can be obtained via https://t.me/BotFather
TOKEN = "8072124230:AAFlek6o8G589fhZrmRSscrtfCZCxNunkAw"

# All handlers should be attached to the Router (or Dispatcher)

dp = Dispatcher()


@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    await message.answer(f"Hello, {html.bold(message.from_user.full_name)}!")

@dp.message(Command('connect_telegram'))
async  def connect_telegram(message: Message) -> None:
    token = secrets.token_hex(16)
    await message.answer(token)
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post('http://127.0.0.1:8000/create_user',
                                          json={'telegram_id': message.from_user.id,
                                                'token': token})
            if response.status_code == 200:
                print('succses')
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