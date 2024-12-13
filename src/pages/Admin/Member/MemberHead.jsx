import Head from '../../../layouts/Admin/components/Head';
import config from '../../../config';

function MemberHead() {
    return (
        <Head
            title={'Quản lý hội viên'}
            route={config.routes.admin.member + '/create'}
        />
    );
}

export default MemberHead;