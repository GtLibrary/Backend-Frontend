import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

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
import configData from '../../../config';

//-----------------------|| DEFAULT DASHBOARD ||-----------------------//

const useStyles = makeStyles((theme) => ({
    content: {
        fontSize: "16px",
    },
    warningContent: {
        color: 'red',
    },
    normalContent: {
        color: 'black',
    }
}));

const Dashboard = () => {
    const classes = useStyles();
    const accountinfo = useSelector((state) => state.account);
    const [neterror, setNeterror] = useState('');

    const getBooklists = async () => {
        await axios
            .get( configData.API_SERVER + 'books/list', { headers: { Authorization: `${accountinfo.token}` } })
            .then(res => {
                if (res.status === 500 || res.status === 400) {
                    console.log(res.data)
                }
            }).catch(error => {
                console.log(error)
                setNeterror("The backend doesn't response now. You may need to logout and back in again.")
            })
    }

    useEffect(() => {
        getBooklists()
    }, [])

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                { neterror == '' ? (
                    <></>
                ): (
                    <>
                        <MainCard border={false} className={classes.content}>
                            <p className={classes.warningContent}>{neterror}</p>
                        </MainCard>
                        <br></br>
                    </>
                )}
                <MainCard border={false} className={classes.content}>
                    <p className={classes.normalContent}>Ready to go live? Email your manuscript(s) to <a href='mailto:info@greatlibrary.io'>info@greatlibrary.io</a> for verification. Please, send us all your manuscripts, rough drafts, maps, art, or other metadata for the property or properties you wish to list with the library even if you haven't created books in the library for them yet. It is better to have more than less for our verification process.</p>
	            <p>New to the library? Read the listing document for help: <a href="https://whitepaper.greatlibrary.io/people/for-new-authors-listing-with-the-library" target="_blank">Listing With The Great Library</a></p>
                </MainCard>
                <br></br>
                <MainCard border={false} className={classes.content}>
                    <p className={classes.normalContent}>If you don't receive a quick response from the above email, contact the head librarian at <a href='mailto:johnrraymond@greatlibrary.io'>johnrraymond@greatlibrary.io</a>.</p>
	            </MainCard>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
