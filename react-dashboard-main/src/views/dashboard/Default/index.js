import React, { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

// project imports
// import EarningCard from './EarningCard';
// import PopularCard from './PopularCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from './../../../store/constant';
import MainCard from './../../../ui-component/cards/MainCard';

//-----------------------|| DEFAULT DASHBOARD ||-----------------------//

const useStyles = makeStyles((theme) => ({
    content: {
        fontSize: "16px",
    },
    warningContent: {
        color: '#009b1a',
        marginBottom: 0
    }
}));

const Dashboard = () => {
    const classes = useStyles();
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <MainCard border={false} className={classes.content}>
                    <p className={classes.warningContent}>When you are ready to go live, from your email address mail your manuscript(s) to info@greatlibrary.io for verification.</p>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
