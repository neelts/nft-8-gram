import * as fs from "fs";
import {bytes2Char} from "@taquito/utils";
import {createHash} from "node:crypto";

type Config = {
	from: { [contract: string]: { id: string, rb: boolean, type: string } };
}

type Grams = {
	grams: { 
		rgb: string,
		type: string,
		token_id: string,
	}[];
}

const g = '8-gram.json';
const c = 'config.json';

const grams: Grams = JSON.parse(fs.readFileSync(g, 'utf-8'));
const config: Config = JSON.parse(fs.readFileSync(c, 'utf-8'));

type Token = {
	value: {
		rgb: string;
		creator: string;
		creater: string;
		token_id: string;
		token_name: string;
		creator_name: string;
		creater_name: string;
		token_description: string;
	}
}

const tokens = async (contract: string): Promise<Token[]> => {
	try {
		return await (
			await fetch(`https://api.tzkt.io/v1/contracts/${contract}/bigmaps/rgb/keys?` +
				`value.token_id.gt=${config.from[contract].id}`
			)
		).json();
	} catch (e) {
		console.log(e);
	}
}

const get = async (): Promise<void> => {

	for (const contract of Object.keys(config.from)) {
		const data = await tokens(contract);
		const { rb, type } = config.from[contract];
		for (const token of data) {
			let {rgb, creator, creater, token_id, token_name, creator_name, creater_name, token_description} = token.value;
			token_description = bytes2Char(token_description);
			const [, hash] = /\[(.+)\]/gm.exec(token_description) ?? [];
			if (hash?.length === 64) {
				if (rb) rgb = bytes2Char(rgb);
				token_name = bytes2Char(token_name);
				creator_name = (creator_name?.length | creater_name?.length) ? bytes2Char(creator_name ?? creater_name) : '';
				const [, fee, recipient] = /(\S+)ꜩ → \{(\S+)\}/gm.exec(token_description) ?? [];
				const sha = createHash('sha256');
				const desc = token_description.split(' \n');
				desc.pop();
				const input = `${contract}:${creator ?? creater}:${creator_name}:${token_name}${desc.join(' \n')}:${rgb}:` +
					`${recipient ?? ''}:${fee ?? ''}`;
				sha.update(
					input,
					'utf-8'
				);
				const hex = sha.digest('hex');
				if (hex === hash)
					grams.grams.push({ rgb, token_id, type });
			}
		}
		if (data?.length)
			config.from[contract].id = data[data.length - 1].value.token_id;
	}

	fs.writeFileSync(g, JSON.stringify(grams, null, 2));
	fs.writeFileSync(c, JSON.stringify(config, null, 2));
};

get();