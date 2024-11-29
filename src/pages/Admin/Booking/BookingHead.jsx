import Head from '../../../layouts/Admin/components/Head';
import config from '../../../config';

function BookingHead() {
    return (
        <Head
            title={'Quản lý đặt vé'}
            route={config.routes.admin.booking + '/create'}
        />
    );
}

export default BookingHead;