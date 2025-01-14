module.exports = {
    apps: [
      {
        name: 'TEST_FA_33051', // ชื่อของโปรเซสใน pm2
        script: 'node_modules/react-scripts/scripts/start.js', // คำสั่งที่ใช้ในการรัน React app
        env: {
          PORT: 33051, // ตั้งค่า port ที่จะใช้
          NODE_ENV: 'development', // ระบุว่าเป็นการรันในโหมด development
        },
      },
    ],
  };
  