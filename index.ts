import * as fs from "fs";
import {bytes2Char} from "@taquito/utils";
import {createHash} from "node:crypto";

type Config = {
	from: { [contract: string]: { id: number, rb: boolean } };
}

type Grams = {
	grams: string[];
}

const gram = '8-gram.json';

const grams: Grams = JSON.parse(fs.readFileSync(gram, 'utf-8'));
const config: Config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

type Token = {
	value: {
		rgb: string;
		creater: string;
		token_id: string;
		token_name: string;
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
		const rb = config.from[contract].rb;
		data.forEach((token) => {
			let {rgb, creater, token_id, token_name, creater_name, token_description} = token.value;
			if (rb) rgb = bytes2Char(rgb);
			token_name = bytes2Char(token_name);
			creater_name = bytes2Char(creater_name);
			token_description = bytes2Char(token_description);
			const [, fee, recipient] = /(\S+)ꜩ → \{(\S+)\}/gm.exec(token_description);
			const [, hash] = /\[(.+)\]/gm.exec(token_description);
			if (hash) {
				const sha = createHash('sha256');
				const desc = token_description.split('\n');
				desc.pop();
				sha.update(
					`${contract}:${creater}:${creater_name}:${token_name}:${desc.join('\n')}:${rgb}:` +
					`${recipient ?? ''}:${fee ?? ''}`,
					'utf-8'
				);
				console.log([hash, sha.digest().toString('hex')]); 
			}
		})
	}

	fs.writeFileSync(gram, JSON.stringify(grams, null, 2));
};

get();