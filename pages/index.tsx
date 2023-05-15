/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, {useContext} from 'react';
import {useRouter} from 'next/router';
import {CredentialsContext} from './_app';
import LandingPage from '@/components/LandingPage';
import MainPage from '@/components/MainPage';

const index = () => {
	const {credentials} = useContext(CredentialsContext);

	const router = useRouter();

	if (credentials === null) {
		return (
			<LandingPage />
		);
	}

	return (
		<MainPage />
	);
};

export default index;

