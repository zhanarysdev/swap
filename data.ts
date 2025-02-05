export const sideBarMenu = [
  {
    label: "Статистика",
    href: "/statistics",
    icon: "Charts",
  },
  {
    label: "Бизнес",
    href: "/busines",
    icon: "Bag",
  },
  {
    label: "Инфлюэнсеры",
    href: "/influencers",
    icon: "Users",
  },
  {
    label: "Объявления",
    href: "/ads",
    icon: "Ads",
  },
  {
    label: "Уведомления",
    href: "/notifications",
    icon: "Bell",
  },
  {
    label: "Банеры",
    href: "/banners",
    icon: "Image",
  },
  {
    label: "Подборки категорий",
    href: "/categories",
    icon: "Category",
  },
  {
    label: "Модерация",
    href: "/moderation",
    icon: "Info",
    submenu: [
      {
        label: "Публикации",
        href: "/moderation/publications",
      },
      {
        label: "Отчеты",
        href: "/moderation/reports",
      },
    ],
  },
  {
    label: "Справочник",
    href: "/directories",
    icon: "Directories",
    submenu: [
      {
        label: "Категория бизнеса инфл...",
        href: "/directories/categories",
      },
      {
        label: "Города",
        href: "/directories/cities",
      },
      {
        label: "Шаблоны условий для...",
        href: "/directories/patterns",
        sub_submenu: [
          {
            label: "Контент",
            href: "/directories/patterns/content",
          },
          {
            label: "Одежда",
            href: "/directories/patterns/clothe",
          },
        ],
      },
      {
        label: "Рейтинг инфлюэнсера",
        href: "/directories/influencers",
      },
      {
        label: "СМС",
        href: "/directories/sms",
      },
    ],
  },
];

export const categories = [
  {
    id: 0,
    name: "Пора качаться",
    location: "Алматы",
    count: 5,
  },
  {
    id: 1,
    name: "Пора качаться",
    location: "Алматы",
    count: 5,
  },
  {
    id: 2,
    name: "Пора качаться",
    location: "Алматы",
    count: 5,
  },
  {
    id: 3,
    name: "Пора качаться",
    location: "Алматы",
    count: 5,
  },
  {
    id: 4,
    name: "Пора качаться",
    location: "Алматы",
    count: 5,
  },
];
