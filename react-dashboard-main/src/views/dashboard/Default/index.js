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
	        <p className={classes.warningContent}>Ready to go live? Email your manuscript(s) to <a href='mailto:info@greatlibrary.io'>info@greatlibrary.io</a> for verification. Please, send us all your manuscripts, rough drafts, maps, art, or other metadata for the property or properties you wish to list with the library even if you haven't created books in the library for them yet. It is better to have more than less for our verification process.</p>
	    </MainCard>
	    <br></br>
	    <MainCard border={false} className={classes.content}>
	        <p className={classes.warningContent}>If you don't receive a quick response from the above email, contact the head librarian at <a href='mailto:johnrraymond@greatlibrary.io'>johnrraymond@greatlibrary.io</a>.</p>
	    </MainCard>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
