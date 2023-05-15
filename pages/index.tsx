/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, {useContext} from 'react';
import {useRouter} from 'next/router';
import {CredentialsContext} from './_app';

const index = () => {
	const {credentials} = useContext(CredentialsContext);

	const router = useRouter();

	if (typeof window !== 'undefined') {
		if (credentials === null) {
			router.push('/login');
		} else {
			router.push('/stocks');
		}
	}
};

export default index;
