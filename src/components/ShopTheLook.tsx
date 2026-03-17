import look1Image from "@/assets/look1.webp";
import look2Image from "@/assets/look2.webp";
import look3Image from "@/assets/look3.webp";
import look4Image from "@/assets/look4.webp";

const lookItems = [
  { imageUrl: look1Image },
  { imageUrl: look2Image },
  { imageUrl: look3Image },
  { imageUrl: look4Image }
];

export const ShopTheLook = () => {
  return (
    <section className="section-padding py-12">
      <h2 className="font-serif text-2xl md:text-3xl text-center mb-8 tracking-wide">Styled #Muslimeem Looks</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {lookItems.map((item, index) => (
          <div key={index} className="relative aspect-[3/4] overflow-hidden">
            <img 
              src={item.imageUrl} 
              alt={`Look ${index + 1}`} 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>
    </section>
  );
};