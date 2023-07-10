import icons from './icons'

const { MdOutlineLibraryMusic, MdOutlineFeed, TbChartArcs, FiPieChart } = icons

export const sidebarMenu = [
    {
        path: 'mymusic',
        text: 'Cá nhân',
        icons: <MdOutlineLibraryMusic side={24}/>
    },
    {
        path: '',
        text: 'Khám phá',
        end: true,
        icons: <TbChartArcs side={24}/>
    },
    {
        path: 'zing-chart',
        text: '#zing-chart',
        icons: <FiPieChart side={24}/>
    },
    {
        path: 'follow',
        text: 'Theo dõi',
        icons: <MdOutlineFeed side={24}/>
    } 
]