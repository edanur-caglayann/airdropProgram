*Airdrop Nedir?*
Airdrop, genellikle bir kripto para birimini ücretsiz olarak bir cüzdana gönderme işlemidir. Bu işlem, kripto para birimini tanıtmak veya kullanıcıların blockchain teknolojisi ile işlem yapmalarını sağlamak amacıyla gerçekleştirilir.

Gerekli Modüllerin İçe Aktarılması
Projemize başlarken, gerekli modülleri içe aktaralım:

const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

*Cüzdan Oluşturma*
Blockchain'de her işlem cüzdanlar üzerinden gerçekleştirilir. Öncelikle bir cüzdan nasıl oluşturulur bakalım:

const newPair = new Keypair(); 
Bu satır, Keypair türünde bir cüzdan nesnesi oluşturur. Bu nesne, hem genel anahtarı hem de özel anahtarı birlikte saklar. Genel anahtarı şu şekilde elde edebiliriz:

const publicKey = newPair.publicKey.toString();
Bu ifade, genel anahtarı publicKey değişkenine atar. Özel anahtarı ise:

const secretKey = newPair.secretKey;
Bu şekilde elde ederiz. Özel anahtar, cüzdana erişim sağlamak ve işlemleri imzalamak için kullanılırken, genel anahtar herkesle paylaşılabilir.

*Cüzdan Bakiyesi Sorgulama*
Cüzdan bakiyesini yazdıran bir fonksiyon oluşturalım:

const getWalletBalance = async () => { ... }
Bu fonksiyon adım adım şu işlemleri gerçekleştirir:

*Ağ Bağlantısı Kurma:*

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
Solana devnet ağına bağlanmak için bir Connection nesnesi oluşturur. clusterApiUrl("devnet"), devnet ağına erişim URL'sini sağlar, "confirmed" ise işlemin onaylanma durumunu belirtir.

*Cüzdan Oluşturma:*

const myWallet = await Keypair.fromSecretKey(secretKey);
Gizli anahtar kullanılarak bir cüzdan nesnesi oluşturulur.

*Cüzdan Bakiyesi Alma:*

const walletBalance = await connection.getBalance(new PublicKey(myWallet.publicKey));
Bu aşamada connection.getBalance fonksiyonu ile cüzdan bakiyesi alınır.

*Sonuçları Konsola Yazdırma:*

console.log("Cüzdan adresi => " + `${myWallet.publicKey.toBase58()}`);
console.log("Cüzdan bakiyesi => " + `${walletBalance / LAMPORTS_PER_SOL} SOL`);
Cüzdan adresi ve bakiyesi ekrana bastırılır.

*Cüzdana Airdrop Yapma*
Şimdi cüzdana SOL airdropu yapan bir fonksiyon oluşturalım:

const airDropSol = async () => { ... }
Bu fonksiyon şu adımları izler:

*Airdrop Talebi:*

const fromAirDropSignature = await connection.requestAirdrop(
    new PublicKey(walletKeyPair.publicKey), 2 * LAMPORTS_PER_SOL
);
connection.requestAirdrop fonksiyonu kullanılarak cüzdana airdrop yapılması talep edilir. Burada walletKeyPair.publicKey, cüzdanın herkese açık anahtarını döner ve bu anahtar PublicKey nesnesine dönüştürülür. LAMPORTS_PER_SOL, Solana ağındaki en küçük para birimidir ve 1 SOL, 1.000.000.000 lamport'a eşittir. 2 * LAMPORTS_PER_SOL ifadesi, miktarın lamport cinsinden hesaplanmasını sağlar.

*İşlemi Onaylama:*

await connection.confirmTransaction(fromAirDropSignature);
Airdrop işleminin onaylanması sağlanır.

*Airdrop Sonrası Bakiye Kontrolü*
Son olarak, airdrop işlemi gerçekleştiğinde bakiyeyi sorgulayalım.

const driverFunction = async () => {
    await getWalletBalance(); // Mevcut bakiye
    await airDropSol(); // Airdrop işlemi
    await getWalletBalance(); // Güncellenmiş bakiye
}
Bu fonksiyon, işlemleri sırasıyla gerçekleştirir ve her adımda beklenen çıktıları sağlar.
