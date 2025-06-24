#!/usr/bin/env node

/**
 * 配置检查脚本
 * 用于诊断图书管理系统的配置问题
 */

console.log('🔍 检查项目配置...\n');

// 检查环境变量
function checkEnvironmentVariables() {
    console.log('📋 检查环境变量:');
    
    const requiredEnvVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];
    
    let hasAllRequiredVars = true;
    
    requiredEnvVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`);
        } else {
            console.log(`  ❌ ${varName}: 未设置`);
            hasAllRequiredVars = false;
        }
    });
    
    if (!hasAllRequiredVars) {
        console.log('\n🚨 缺少必要的环境变量！');
        console.log('请创建 .env.local 文件并添加以下变量:');
        console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
    }
    
    return hasAllRequiredVars;
}

// 检查包依赖
function checkDependencies() {
    console.log('\n📦 检查依赖包:');
    
    try {
        const packageJson = require('../package.json');
        const requiredDeps = [
            '@supabase/ssr',
            '@supabase/supabase-js',
            'zod',
            '@tanstack/react-query'
        ];
        
        let hasAllDeps = true;
        
        requiredDeps.forEach(dep => {
            const version = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
            if (version) {
                console.log(`  ✅ ${dep}: ${version}`);
            } else {
                console.log(`  ❌ ${dep}: 未安装`);
                hasAllDeps = false;
            }
        });
        
        return hasAllDeps;
    } catch (error) {
        console.log('  ❌ 无法读取 package.json');
        return false;
    }
}

// 检查文件结构
function checkFileStructure() {
    console.log('\n📁 检查文件结构:');
    
    const fs = require('fs');
    const path = require('path');
    
    const requiredFiles = [
        'src/config/supabase.ts',
        'src/utils/supabase/client.ts',
        'src/utils/supabase/server.ts',
        'src/app/api/user/register/route.ts',
        'src/app/user/register/page.tsx'
    ];
    
    let hasAllFiles = true;
    
    requiredFiles.forEach(filePath => {
        const fullPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
            console.log(`  ✅ ${filePath}`);
        } else {
            console.log(`  ❌ ${filePath}: 文件不存在`);
            hasAllFiles = false;
        }
    });
    
    return hasAllFiles;
}

// 提供解决方案
function provideSolutions() {
    console.log('\n💡 常见问题解决方案:');
    console.log('');
    console.log('1. 环境变量问题:');
    console.log('   - 确保在项目根目录创建 .env.local 文件');
    console.log('   - 从 Supabase 项目设置中获取正确的 URL 和 Key');
    console.log('   - 重启开发服务器使环境变量生效');
    console.log('');
    console.log('2. Supabase 配置问题:');
    console.log('   - 检查 Supabase 项目是否启用了用户注册');
    console.log('   - 确认 Authentication 设置中的策略');
    console.log('   - 检查是否设置了正确的重定向 URL');
    console.log('');
    console.log('3. 网络问题:');
    console.log('   - 检查网络连接');
    console.log('   - 确认防火墙没有阻止 Supabase 连接');
    console.log('   - 检查浏览器控制台的网络错误');
    console.log('');
    console.log('4. 数据验证问题:');
    console.log('   - 确保邮箱格式正确');
    console.log('   - 确保密码满足强度要求');
    console.log('   - 确保确认密码与密码一致');
}

// 主函数
async function main() {
    const envCheck = checkEnvironmentVariables();
    const depCheck = checkDependencies();
    const fileCheck = checkFileStructure();
    
    console.log('\n📊 检查结果:');
    console.log(`环境变量: ${envCheck ? '✅' : '❌'}`);
    console.log(`依赖包: ${depCheck ? '✅' : '❌'}`);
    console.log(`文件结构: ${fileCheck ? '✅' : '❌'}`);
    
    if (envCheck && depCheck && fileCheck) {
        console.log('\n🎉 配置检查通过！如果仍有问题，请检查 Supabase 项目设置。');
    } else {
        console.log('\n⚠️  发现配置问题，请根据上述结果进行修复。');
    }
    
    provideSolutions();
}

main().catch(console.error); 