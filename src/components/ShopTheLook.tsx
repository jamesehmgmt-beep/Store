import look1Image from "@/assets/look1.png";
import look2Image from "@/assets/look2.png";
import look3Image from "@/assets/look3.png";
import look4Image from "@/assets/look4.png";

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
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>
    </section>
  );
};