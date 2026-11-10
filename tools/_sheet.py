
import os, glob
from PIL import Image, ImageDraw, ImageFont
OUT = r"E:/亚文化小程序开发/.workbuddy/render"
names = [
 ("pages-home-home","首页"),("pages-tests-tests","测评"),("pages-community-community","社区"),("pages-shop-shop","商城"),
 ("pages-filter-filter","筛选"),("pages-mine-mine","我的"),("pages-test-detail-test-detail","测试详情"),("pages-question-question","答题"),
 ("pages-generating-generating","生成中"),("pages-result-result","结果页"),("pages-type-type","人格档案"),("pages-card-card","人格名片"),
 ("pages-cooperation-cooperation","合作"),("pages-search-search","搜索"),("pages-category-category","分类"),("pages-shop-detail-shop-detail","商品详情"),
 ("pages-shop-home-shop-home","店铺主页"),("pages-post-detail-post-detail","帖子详情"),("post-detail-article","文章详情"),("pages-post-publish-post-publish","投稿"),
 ("pages-drafts-drafts","草稿"),("pages-merchant-apply-merchant-apply","商家入驻"),("pages-followed-shops-followed-shops","关注店铺"),("pages-favorites-favorites","收藏"),
 ("pages-history-history","历史"),("pages-reports-reports","报告"),("pages-my-report-my-report","报告详情"),("pages-settings-settings","设置"),
 ("pages-register-register","登录"),("pages-interests-interests","兴趣"),("pages-legal-legal","隐私"),("pages-index-index","启动")
]
font = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", 20)
W = 430
cols, rows = 4, 2
pad = 14
for si in range(4):
    chunk = names[si*8:(si+1)*8]
    imgs=[]
    for key,label in chunk:
        f = os.path.join(OUT,key+".png")
        if not os.path.exists(f): 
            print("MISS",f); continue
        im = Image.open(f).convert("RGB")
        h = int(im.height * W / im.width)
        imgs.append((im.resize((W,h), Image.LANCZOS), label))
    if not imgs: continue
    cellH = max(i.height for i,_ in imgs) + 34
    sheet = Image.new("RGB", (cols*W + (cols+1)*pad, rows*cellH + (rows+1)*pad), (232,232,236))
    d = ImageDraw.Draw(sheet)
    for i,(im,label) in enumerate(imgs):
        c,r = i%cols, i//cols
        x = pad + c*(W+pad); y = pad + r*(cellH+pad)
        d.text((x+4,y+4), label, fill=(20,20,24), font=font)
        sheet.paste(im,(x,y+30))
    out = os.path.join(OUT, "sheet-13-%d.png" % (si+1))
    sheet.save(out, optimize=True)
    print(out, sheet.size)
