// Kullanacağımız modüller
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

const newPair = new Keypair(); // Keypair türünde bir cüzdan nesnesi (Genel anahtar + Özel anahtar tutar)

// Açık anahtarı yeni bir değişkene atayıp saklayalım.
const publicKey = newPair.publicKey.toString();
// Açık anahtardan özel anahtarı çıkarıp 64 bit uzunluğundaki yeni değişkende (secretKey) saklayalım.
const secretKey = newPair.secretKey;

const getWalletBalance = async () => {
    try {  
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Gizli anahtardan cüzdan nesnesi oluşturma
        const myWallet = await Keypair.fromSecretKey(secretKey);
        const walletBalance = await connection.getBalance(new PublicKey(myWallet.publicKey)); // Cüzdan bakiyesini alma

        console.log("Cüzdan adresi => " + `${myWallet.publicKey.toBase58()}`);
        console.log("Cüzdan bakiyesi => " + `${walletBalance / LAMPORTS_PER_SOL} SOL`);
    } catch(err) {
        console.log("Hata oluştu: ", err);
    }
}

const airDropSol = async () => {
    try {
        // Devnet ağına bağlanmak için bağlantı nesnesi oluşturma
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Gizli anahtardan cüzdan nesnesi oluşturma
        const walletKeyPair = await Keypair.fromSecretKey(secretKey);

        // Airdrop imzası oluşturma
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(walletKeyPair.publicKey), 2 * LAMPORTS_PER_SOL
        );

        // İşlemi onaylama
        await connection.confirmTransaction(fromAirDropSignature);

        console.log("Airdrop başarılı! İmza: " + fromAirDropSignature);
    } catch(err) {
        console.log("Hata oluştu: ", err);
    }
}

const driverFunction = async () => {
    try {
        await getWalletBalance(); // cüzdan bakiye kontrolü
        await airDropSol(); // cüzdana airdrop yollama
        await getWalletBalance(); // bakiye kontrolü
    } catch(err) {
        console.log("Hata oluştu: ", err); 
    }
}

driverFunction();
