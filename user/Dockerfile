# Используем официальный образ Node.js + Alpine
FROM node:20-alpine

# Устанавливаем pnpm
RUN npm install -g pnpm

# Рабочая директория
WORKDIR /app

# Копируем только зависимости
COPY pnpm-lock.yaml package.json ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем остальной код
COPY . .

# Открываем порт
EXPOSE 3000

# Запуск приложения
CMD ["pnpm", "start"]
