export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: {
                lang: 'ru'
            },
            title: 'Школьное здоровье',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Система для отслеживания здоровья учащихся школы'
                }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                {
                    rel: 'preload',
                    href: '/fonts/Rubik-Regular.woff2',
                    as: 'font',
                    type: 'font/woff2',
                    crossorigin: ''
                }
            ]
        }
    },

    css: [
        'primevue/resources/themes/lara-light-blue/theme.css',
        'primevue/resources/primevue.css',
        'primeicons/primeicons.css',
        'primeflex/primeflex.css',

        '~/assets/css/rubik.fontface.css',
        '~/assets/css/main.css'
    ],

    modules: ['@nuxt/image-edge'],

    build: {
        transpile: ['primevue']
    }
})