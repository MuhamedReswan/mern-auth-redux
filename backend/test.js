import bcrypt from 'bcryptjs';

async function testHashing() {
    const plainPassword = "mypassword123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log("Plain:", plainPassword);
    console.log("Hashed:", hashedPassword);
}

testHashing();
