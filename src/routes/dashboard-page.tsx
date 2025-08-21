import { MoonLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { formatNumberInReadableForm } from '@/helpers/string-helper';
import env from '@/env';
import { useClients } from '@/modules/clients/hooks';

const colors = {
    primary: {
        default: `#${env.APP_COLOR_PRIMARY_DEFAULT}`,
    },
    secondary: `#${env.APP_COLOR_SECONDARY_DEFAULT}`

}


const StatsCard = ({ title, value }: any) => {
    return (
        <div className='  flex flex-col gap-y-3 flex-grow flex-wrap px-3 py-6  '>
            <h1 className='leading-8 text-2xl md:text-3xl font-semibold'>{title}</h1>
            <h3 className='flex flex-grow font-bold md:text-6xl my-2  lg:text-[60px] text-4xl items-center '>{formatNumberInReadableForm(value)}</h3>
        </div>
    )
}


const DashboardPage = () => {
    const { useGetTotalClients, useGetTotalRecommendations } = useClients();
    const { data: totalClients, isError: isClientEror, refetch: refetchClients, isLoading: isClientLoading } = useGetTotalClients();
    const { data: totalRecommendations, isError: isRecommendationError, refetch: refetchRecommendations, isLoading: isRecommendationLoading } = useGetTotalRecommendations();
    // const { data: totalRecommendations } = useClients().useGetTotalRecommendations();

    // const [totalClient, setTotalClient] = useState(0);
    // const [totalRecommendation, setTotalRecommendation] = useState(0);
    // const [swr, setSWR] = useState(false);
    // const [pageLoading, setPageLoading] = useState(false);

    // const fetchTotalClients = async () => {
    //     const res = await ClientApi.getTotalClients();
    //     setTotalClient(res ?? 0);
    // }

    // const fetchTotalRecommendations = async () => {
    //     const res = await ClientApi.getTotalRecommendations();
    //     setTotalRecommendation(res ?? 0);
    // }


    // const init = async () => {
    //     try {
    //         setSWR(false);
    //         setPageLoading(true);
    //         await fetchTotalClients();
    //         await fetchTotalRecommendations();

    //     } catch (error) {
    //         setSWR(true);
    //     } finally {
    //         setPageLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     init();
    // }, [])

    if (isClientLoading || isRecommendationLoading) {
        return (
            <div className='flex flex-grow items-center justify-center' >
                <MoonLoader size={36} />
            </div>
        );
    }

    if (isClientEror || isRecommendationError) {
        return (
            <>
                <div className='flex flex-grow items-center justify-center' >
                    <span>Something went wrong</span>
                    <button onClick={() => { refetchClients() }} className=' text-sm text-blue-300'>Try again</button>
                </div>
            </>
        )
    }

    // if (totalClients && totalRecommendations) {
    return (
        <>
            <div className='lg:container w-full  mx-auto py-3 px-2' >
                <h1 className='font-bold text-3xl'>Dashboard</h1>

                <div className='flex flex-col  sm:flex-col md:flex-row mt-3 w-full flex-wrap     border-2 text-white' style={{ backgroundColor: `${colors.primary.default}`, borderColor: `${colors.primary.default}` }}>
                    <div className='lg:w-1/2 sm:w-full' style={{ backgroundColor: `${colors.primary.default}` }}  ><StatsCard title={"Total Clients"} value={totalClients} /></div>
                    <div className='lg:w-1/2 sm:w-full bg-white' style={{ color: `${colors.primary.default}` }}><StatsCard title={"Total Recommendations"} value={totalRecommendations} /></div>
                </div>
                <Link className='flex items-center justify-end mt-3' to={'/clients'}><button className=' text-white py-2 px-3 font-medium rounded' style={{ backgroundColor: `${colors.primary.default}` }}>View Details</button> </Link>

            </div>
        </>
    );
    // }

};

export default DashboardPage;
