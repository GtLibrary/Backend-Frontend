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
        color: 'black',
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
                    <p className={classes.warningContent}>When you are ready to go live, from your email address mail your manuscript(s) to <a href='mailto:info@greatlibrary.io'>info@greatlibrary.io</a> for verification.</p>
                </MainCard>
                <br></br>
                <MainCard border={false} className={classes.content}>
                    <p className={classes.warningContent}>Authors may want to only go through the hassle of creating one book on the author portal, but we still need to vet them as authors and to do that we want them to send us all their manuscripts to <a href='mailto:info@greatlibrary.io'>info@greatlibrary.io</a> so they can be vetted and become “Is Verified.”</p>
                    <p className={classes.warningContent}>All rough drafts and extra material should be included in this or follow up emails. This includes pdfs, docs, txt, links, jpgs, pngs, only excluding exe and other self executing binaries. (Authors should arrange for further vetting in that case.)</p>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
