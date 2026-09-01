const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const rootDir = path.resolve(__dirname);

const sourceDirs = [
    path.join(rootDir, 'scripts', 'dorado'),
    path.join(rootDir, 'skins', 'default'),
    path.join(rootDir, 'skins', 'modern'),
    path.join(rootDir, 'console', 'scripts')
];

const excluded = ['_convert.js'];

async function processFiles() {
    console.log('Starting minification process...\n');
    
    for (const dir of sourceDirs) {
        if (!fs.existsSync(dir)) {
            continue;
        }
        
        const files = fs.readdirSync(dir).filter(f => {
            if (f.endsWith('.min.js')) return false;
            if (excluded.includes(f)) return false;
            return f.endsWith('.js');
        });
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) continue;
            
            const baseName = path.basename(file, '.js');
            const minFileName = `${baseName}.min.js`;
            const minFilePath = path.join(dir, minFileName);
            
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                
                const result = await minify(content, {
                    compress: {
                        drop_console: false,
                        drop_debugger: true
                    },
                    mangle: {
                        toplevel: false,
                        keep_classnames: true,
                        keep_fnames: true
                    },
                    format: {
                        comments: false,
                        beautify: false
                    }
                });
                
                if (result.error) {
                    console.log(`❌ Error minifying ${file}: ${result.error.message}`);
                    continue;
                }
                
                fs.writeFileSync(minFilePath, result.code);
                
                const originalSize = content.length;
                const minSize = result.code.length;
                const ratio = ((1 - minSize / originalSize) * 100).toFixed(1);
                
                console.log(`✅ ${file} -> ${minFileName}`);
                console.log(`   ${originalSize.toLocaleString()} bytes -> ${minSize.toLocaleString()} bytes (${ratio}% reduction)\n`);
                
            } catch (err) {
                console.log(`❌ Error processing ${file}: ${err.message}\n`);
            }
        }
    }
    
    console.log('Minification completed!');
}

processFiles().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
