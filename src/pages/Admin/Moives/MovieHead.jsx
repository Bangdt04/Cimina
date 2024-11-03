import Head from '../../../layouts/Admin/components/Head';
import config from '../../../config';
function MovieHead() {
    return (
        <Head
            title={'Quản lý phim'}
            route={config.routes.admin.movies + '/create'}
        />
    );
}

export default MovieHead;