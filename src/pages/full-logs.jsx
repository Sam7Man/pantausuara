import { Helmet } from 'react-helmet-async';

import { FullLogsView } from 'src/sections/logs';


export default function FullLogsPage() {
    return (
        <>
            <Helmet>
                <title> Full Logs | Pantausuara </title>
            </Helmet>

            <FullLogsView />
        </>
    );
}
