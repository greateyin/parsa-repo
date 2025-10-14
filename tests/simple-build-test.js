/**
 * Simple Build Test
 * Tests basic site building without complex module dependencies
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
}

function testSimpleBuild() {
    try {
        log('Testing simple Hugo build...');
        
        const exampleSitePath = path.join(__dirname, '..', 'exampleSite');
        
        // Clean previous build
        const publicPath = path.join(exampleSitePath, 'public');
        if (fs.existsSync(publicPath)) {
            fs.rmSync(publicPath, { recursive: true, force: true });
            log('Cleaned previous build');
        }

        // Try building with basic configuration
        try {
            process.chdir(exampleSitePath);
            
            // Create a minimal test build
            const buildOutput = execSync('hugo --quiet --minify', { 
                encoding: 'utf8',
                timeout: 30000,
                stdio: 'pipe'
            });

            log('Hugo build completed');
            
            // Check if basic files were generated
            if (fs.existsSync('public/index.html')) {
                log('✅ Index page generated successfully', 'success');
                
                // Check content
                const indexContent = fs.readFileSync('public/index.html', 'utf8');
                
                // Basic content checks
                if (indexContent.includes('<html')) {
                    log('✅ Valid HTML structure', 'success');
                } else {
                    log('❌ Invalid HTML structure', 'error');
                }
                
                if (indexContent.includes('G-JKSVCT23D1')) {
                    log('✅ Google Analytics integrated', 'success');
                } else {
                    log('⚠️ Google Analytics not found', 'warning');
                }
                
                if (indexContent.includes('ca-pub-2970874383549118')) {
                    log('✅ AdSense integrated', 'success');
                } else {
                    log('⚠️ AdSense not found', 'warning');
                }
                
                return true;
                
            } else {
                log('❌ Index page not generated', 'error');
                return false;
            }
            
        } catch (buildError) {
            log(`Build error: ${buildError.message}`, 'error');
            return false;
        }
        
    } catch (error) {
        log(`Test error: ${error.message}`, 'error');
        return false;
    } finally {
        // Return to original directory
        process.chdir(path.join(__dirname, '..'));
    }
}

// Run the test
if (require.main === module) {
    const success = testSimpleBuild();
    process.exit(success ? 0 : 1);
}

module.exports = { testSimpleBuild };