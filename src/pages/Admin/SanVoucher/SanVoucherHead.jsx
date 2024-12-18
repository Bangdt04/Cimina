import Head from '../../../layouts/Admin/components/Head';
import config from '../../../config';

function SanVoucherHead() {
    return (
        <Head
            title={'Quản lý SanVoucher'}
            route={config.routes.admin.sanvoucher + '/create'}
        />
    );
}

export default SanVoucherHead;