Проєкт: Реєстрація та Дашборд на Next.js + Supabase

Опис проекту

Веб-застосунок для реєстрації, входу користувача, підтвердження email, відновлення паролю та перегляду дашборду з інформацією користувача.  
Інформація в дашборді включає email, ID користувача та дату створення акаунту.

Також після авторизації користувач бачить інформацію про свій аккаунт 
та власну галерею з можливістю додавати фото (одне або декілька за раз).

Todo list:
В навігаційному меню є кпопка для переходу в ToDo list користувача, в якому можна створити задачу, переміщати її власноруч
між колонками "потрібно виконати" "в процесі" "виконано", а також переглянути інформацію про задачу натиснувши на значок ока на ній

Використані технології

- Next.js 
- React 
- TypeScript
- Material UI (MUI)
- Supabase
- Context API
- CSS Modules / styled-components

Команди для запуску (локально)

1. Клонуйте репозиторій та перейдіть у папку проекту
2. У файлі client.ts можете замінити supabaseUrl та supabaseKey на власні 
2. Встановіть залежності (npm install)
3. Запустіть дев сервер (npm run dev)
4. Відкрийте http://localhost:3000 у браузері та користуйтеся

## Скріни інтерфейсу

### Dashboard
![Dashboard](/public/gallery.png)

### todo
![Dashboard](/public/todo.png)

### SignUp
![SignUp](/public/signup.png)

### Login
![Login](/public/login.png)

### Reset-password
![Reset-password](/public/reset-password.png)

### Reset-password-confirm
![Reset-password-confirm](/public/reset-password-confirm.png)
