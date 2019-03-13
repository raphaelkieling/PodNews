const rimraf = require('rimraf');
const path   = require('path');
const fs     = require('fs');

class FileManager{
	cleanDirectory(path){
		return new Promise((resolve,reject)=>{
			rimraf(path,resolve);
		})
	}

	getPathTemp(){
		return path.resolve(process.cwd(), 'temp');
	}

	async resetTempDirectory(){
		let tempDir = this.getPathTemp();
		//clean directory dir
		await this.cleanDirectory(tempDir);
		//create temporary dir
		return await fs.mkdirSync(tempDir);
	}
}

module.exports = FileManager;