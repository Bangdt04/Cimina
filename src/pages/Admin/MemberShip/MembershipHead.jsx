import Head from '../../../layouts/Admin/components/Head';
import config from '../../../config';

function MembershipHead() {
    return (
        <Head
            title={'Quản lý hội viên'}
            route={config.routes.admin.membership + '/create'}
        />
    );
}

export default MembershipHead;