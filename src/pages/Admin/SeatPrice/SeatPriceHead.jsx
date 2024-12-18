import Head from '../../../layouts/Admin/components/Head';
import config from '../../../config';

function SeatPriceHead() {
    return (
        <Head
            title={'Quản lý ghế'}
            route={config.routes.admin.seatprice + '/create'}
        />
    );
}

export default SeatPriceHead;