import icons from './icons'

const { MdOutlineLibraryMusic } = icons

export const sidebarMenu = [
    {
        path: 'mynusic',
        text: 'Cá nhân',
        icons: <MdOutlineLibraryMusic side={24}/>
    },
    {
        path: '',
        text: 'Khám phá',
        end: true,
        icons: <MdOutlineLibraryMusic side={24}/>
    },
    {
        path: 'zing-chart',
        text: '#zing-chart',
        icons: <MdOutlineLibraryMusic side={24}/>
    },
    {
        path: 'follow',
        text: 'Theo dõi',
        icons: <MdOutlineLibraryMusic side={24}/>
    } 
]